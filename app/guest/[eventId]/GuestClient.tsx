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
        <p className="text-lg animate-pulse">Loading event...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p className="text-lg text-red-500">Event not found</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p className="text-lg text-red-500">No event data</p>
      </div>
    );
  }

  /* ---------------- RENDER ---------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white px-6 py-12">
      <div className="max-w-2xl mx-auto">

        {/* Event Image */}
        {event.image && (
          <img
            src={event.image}
            alt={event.name}
            className="w-full h-64 object-cover rounded-2xl mb-8 shadow-xl"
          />
        )}

        {/* Event Title */}
        <h1 className="text-4xl font-semibold text-center mb-10 tracking-tight">
          {event.name}
        </h1>

        {/* Search Box */}
        <form onSubmit={handleGuestLookup} className="mb-10">
          <label
            htmlFor="guestName"
            className="block text-sm uppercase tracking-wider text-neutral-400 mb-3"
          >
            Find your table
          </label>

          <div className="flex gap-3">
            <input
              id="guestName"
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Enter your name"
              className="flex-1 px-5 py-3 rounded-xl bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
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

        {/* Guest Error */}
        {guestError && (
          <div className="p-4 bg-red-900/40 text-red-400 rounded-xl mb-6">
            {guestError}
          </div>
        )}

        {/* Guest Result */}
        {guestResult && (
          <div className="p-8 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-lg text-center">
            {guestResult.found ? (
              <>
                <p className="text-xl text-neutral-400 mb-2">
                  Welcome
                </p>
                <p className="text-2xl font-semibold mb-4">
                  {guestResult.guest.name}
                </p>

                {guestResult.guest.table !== null ? (
                  <div className="text-5xl font-bold text-yellow-400">
                    Table {guestResult.guest.table}
                  </div>
                ) : (
                  <p className="text-neutral-500 mt-4">
                    No table assigned
                  </p>
                )}
              </>
            ) : (
              <p className="text-neutral-400">
                Guest not found. Please check your name and try again.
              </p>
            )}
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12 text-center text-neutral-500 text-sm">
          {event.layout.tables.length} tables at this event
        </div>
      </div>
    </div>
  );
}