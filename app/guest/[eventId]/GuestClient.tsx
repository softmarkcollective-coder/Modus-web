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

  if (notFound || error || !event) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p className="text-lg text-red-500">Event unavailable</p>
      </div>
    );
  }

  /* ---------------- RENDER ---------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-black text-white flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-2xl text-center space-y-16">

        {/* Deploy Marker */}
        <div className="text-red-500 text-xs tracking-[0.3em] uppercase opacity-70">
          Deploy Test Active
        </div>

        {/* Hero Image */}
        {event.image && (
          <div className="relative">
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-80 object-cover rounded-[2rem] shadow-[0_40px_120px_rgba(0,0,0,0.6)]"
            />
            <div className="absolute inset-0 bg-black/40 rounded-[2rem]" />
          </div>
        )}

        {/* Event Title */}
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
          {event.name}
        </h1>

        {/* Search */}
        <form onSubmit={handleGuestLookup} className="space-y-6">

          <p className="text-sm uppercase tracking-[0.4em] text-neutral-500">
            Find your table
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

            <input
              id="guestName"
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Enter your name"
              className="w-full sm:min-w-[320px] px-6 py-4 rounded-2xl bg-neutral-900 border border-neutral-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white text-lg text-center"
            />

            <button
              type="submit"
              disabled={guestLoading || !guestName.trim()}
              className="px-10 py-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-300 text-black font-semibold text-lg shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-40"
            >
              {guestLoading ? "..." : "Search"}
            </button>

          </div>
        </form>

        {/* Error */}
        {guestError && (
          <div className="p-6 bg-red-900/40 text-red-400 rounded-2xl">
            {guestError}
          </div>
        )}

        {/* Result */}
        {guestResult && (
          <div className="p-12 bg-neutral-900/70 backdrop-blur-xl border border-neutral-800 rounded-[2rem] shadow-[0_20px_80px_rgba(0,0,0,0.6)]">

            {guestResult.found ? (
              <>
                <p className="text-neutral-500 uppercase tracking-[0.4em] text-xs mb-4">
                  Welcome
                </p>

                <p className="text-3xl font-semibold mb-10">
                  {guestResult.guest.name}
                </p>

                {guestResult.guest.table !== null ? (
                  <div className="text-6xl font-bold bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent">
                    Table {guestResult.guest.table}
                  </div>
                ) : (
                  <p className="text-neutral-500">
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
        <div className="text-neutral-600 text-sm">
          {event.layout.tables.length} tables at this event
        </div>

      </div>
    </div>
  );
}