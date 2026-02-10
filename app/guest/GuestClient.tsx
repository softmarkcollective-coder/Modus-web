"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_VIBECODE_API_BASE;

interface Table {
  id: number;
  x: number;
  y: number;
  shape: string;
}

interface EventData {
  id: string;
  name: string;
  image: string | null;
  layout: {
    tables: Table[];
  };
}

interface GuestFoundResponse {
  found: true;
  guest: {
    name: string;
    table: number | null;
  };
}

interface GuestNotFoundResponse {
  found: false;
}

type GuestResponse = GuestFoundResponse | GuestNotFoundResponse;

export default function GuestClient() {
  const params = useParams();
  const eventId = params?.eventId as string | undefined;

  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [guestName, setGuestName] = useState("");
  const [guestResult, setGuestResult] = useState<GuestResponse | null>(null);
  const [guestLoading, setGuestLoading] = useState(false);

  useEffect(() => {
    if (!eventId || !BASE_URL) return;

    async function fetchEvent() {
      try {
        const res = await fetch(
          `${BASE_URL}/api/public/event/${eventId}`,
          { cache: "no-store" }
        );

        if (!res.ok) {
          throw new Error(`Event fetch failed (${res.status})`);
        }

        const data = await res.json();
        setEvent(data);
      } catch (err) {
        setError("Could not load event");
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [eventId]);

  async function handleGuestLookup(e: React.FormEvent) {
    e.preventDefault();
    if (!guestName.trim() || !eventId) return;

    setGuestLoading(true);
    setGuestResult(null);

    const res = await fetch(
      `${BASE_URL}/api/public/event/${eventId}/guest?name=${encodeURIComponent(
        guestName.trim()
      )}`
    );

    const data = await res.json();
    setGuestResult(data);
    setGuestLoading(false);
  }

  if (loading) return <p className="p-8 text-center">Loading…</p>;
  if (error) return <p className="p-8 text-center text-red-600">{error}</p>;
  if (!event) return <p className="p-8 text-center">No event</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">
          {event.name}
        </h1>

        <form onSubmit={handleGuestLookup} className="mb-6">
          <input
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Your name"
            className="w-full border p-3 rounded mb-3"
          />
          <button
            disabled={guestLoading}
            className="w-full bg-black text-white py-3 rounded"
          >
            {guestLoading ? "Searching…" : "Show my table"}
          </button>
        </form>

        {guestResult && (
          <div className="bg-white p-4 rounded shadow text-center">
            {guestResult.found ? (
              <>
                <p>{guestResult.guest.name}</p>
                <p className="text-3xl font-bold mt-2">
                  Table {guestResult.guest.table}
                </p>
              </>
            ) : (
              <p>Guest not found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}