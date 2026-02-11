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
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white px-6 py-16">
      <div className="max-w-3xl mx-auto">

        {/* Hero Image */}
        {event.image && (
          <div className="relative mb-12">
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-72 object-cover rounded-3xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-black/30 rounded-3xl" />
          </div>
        )}

        {/* Event Title */}
        <h1 className="text-5xl font-semibold text-center mb-14 tracking-tight">
          {event.name}
        </h1>

        {/* Search Section */}
        <form onSubmit={handleGuestLookup} className="mb-14">
          <label
            htmlFor="guestName"
            className="block text-xs uppercase tracking-widest text-neutral-500 mb-4 text-center"
          >
            Find your table
          </label>

          <div className="flex flex-col sm:flex-row gap-4">
            <input
              id="guestName"
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Enter your name"
              className="flex-1 px-6 py-4 rounded-2xl bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white text-lg"
            />

            <button
              type="submit"
              disabled={guestLoading || !guestName.trim()}
              className="px-8 py-4 rounded-2xl bg-yellow-400 text-black font-semibold text-lg hover:bg-yellow-300 active:scale-95 transition-all duration-150 shadow-lg disabled:opacity-40"
            >
              {guestLoading ? "..." : "Search"}
            </button>
          </div>
        </form>

        {/* Error */}
        {guestError && (
          <div className="p-5 bg-red-900/40 text-red-400 rounded-2xl mb-8 text-center">
            {guestError}
          </div>
        )}

        {/* Result Card */}
        {guestResult && (
          <div className="p-12 bg-neutral-900/80 backdrop-blur border border-neutral-800 rounded-3xl shadow-2xl text-center transition-all">
            {guestResult.found ? (
              <>
                <p className="text-neutral-400 uppercase tracking-widest text-sm mb-3">
                  Welcome
                </p>

                <p className="text-3xl font-semibold mb-8">
                  {guestResult.guest.name}
                </p>

                {guestResult.guest.table !== null ? (
                  <div className="text-6xl font-bold text-yellow-400">
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

        {/* Footer */}
        <div className="mt-16 text-center text-neutral-600 text-sm">
          {event.layout.tables.length} tables at this event
        </div>
      </div>
    </div>
  );
}