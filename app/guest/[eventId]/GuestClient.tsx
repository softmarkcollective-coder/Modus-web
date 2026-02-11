"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

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
type EventError = { error: string };

export default function GuestClient() {
  const params = useParams();
  const eventId = params.eventId as string;

  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [guestName, setGuestName] = useState("");
  const [guestResult, setGuestResult] = useState<GuestResponse | null>(null);
  const [guestLoading, setGuestLoading] = useState(false);
  const [guestError, setGuestError] = useState<string | null>(null);

  /* ---------------- EVENT FETCH ---------------- */

  useEffect(() => {
    if (!eventId) return;

    async function fetchEvent() {
      setLoading(true);
      setError(null);
      setNotFound(false);

      try {
        const res = await fetch(`/api/guest/event/${eventId}`);

        if (res.status === 404) {
          setNotFound(true);
          return;
        }

        if (res.status === 400) {
          const data = (await res.json()) as EventError;
          setError(data.error || "Bad request");
          return;
        }

        if (!res.ok) {
          setError(`Server error: ${res.status}`);
          return;
        }

        const data = (await res.json()) as EventData;
        setEvent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Network error");
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [eventId]);

  /* ---------------- GUEST LOOKUP ---------------- */

  async function handleGuestLookup(e: React.FormEvent) {
    e.preventDefault();
    if (!guestName.trim()) return;

    setGuestLoading(true);
    setGuestError(null);
    setGuestResult(null);

    try {
      const res = await fetch(
        `/api/guest/event/${eventId}/guest?name=${encodeURIComponent(
          guestName.trim()
        )}`
      );

      if (!res.ok) {
        setGuestError(`Server error: ${res.status}`);
        return;
      }

      const data = (await res.json()) as GuestResponse;
      setGuestResult(data);
    } catch (err) {
      setGuestError(err instanceof Error ? err.message : "Network error");
    } finally {
      setGuestLoading(false);
    }
  }

  /* ---------------- UI STATES ---------------- */

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        Loading event...
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-red-400">
        Event not found
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-red-400">
        Error: {error}
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-red-400">
        No event data
      </div>
    );
  }

  /* ---------------- PREMIUM RENDER ---------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-lg space-y-8">

        {event.image && (
          <div className="overflow-hidden rounded-2xl shadow-2xl">
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-56 object-cover"
            />
          </div>
        )}

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            {event.name}
          </h1>
          <p className="text-gray-400 text-sm">
            Find your table
          </p>
        </div>

        <form onSubmit={handleGuestLookup} className="space-y-4">
          <div className="flex gap-3">
            <input
              id="guestName"
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Enter your name"
              className="flex-1 px-5 py-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white/40 transition"
            />
            <button
              type="submit"
              disabled={guestLoading || !guestName.trim()}
              className="px-6 py-3 rounded-xl bg-yellow-400 text-black font-medium hover:bg-yellow-300 transition disabled:opacity-40"
            >
              {guestLoading ? "..." : "Search"}
            </button>
          </div>
        </form>

        {guestError && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl text-center">
            Error: {guestError}
          </div>
        )}

        {guestResult && (
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 text-center shadow-xl">
            {guestResult.found ? (
              <>
                <p className="text-lg text-gray-300">
                  {guestResult.guest.name}
                </p>

                {guestResult.guest.table !== null ? (
                  <p className="text-5xl font-bold text-yellow-400 mt-4">
                    Table {guestResult.guest.table}
                  </p>
                ) : (
                  <p className="text-gray-400 mt-4">
                    No table assigned
                  </p>
                )}
              </>
            ) : (
              <p className="text-gray-400">
                Guest not found. Please check your name.
              </p>
            )}
          </div>
        )}

        <div className="text-center text-xs text-gray-500 pt-6">
          {event.layout.tables.length} tables at this event
        </div>

      </div>
    </div>
  );
}