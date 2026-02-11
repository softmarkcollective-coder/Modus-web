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
      try {
        const res = await fetch(`/api/guest/event/${eventId}`);

        if (res.status === 404) {
          setNotFound(true);
          return;
        }

        const data = (await res.json()) as EventData;
        setEvent(data);
      } catch {
        setError("Network error");
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

      const data = (await res.json()) as GuestResponse;
      setGuestResult(data);
    } catch {
      setGuestError("Network error");
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

  if (notFound || error || !event) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        Event unavailable
      </div>
    );
  }

  /* ---------------- RENDER ---------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-black text-white flex items-start justify-center px-6 pt-10 pb-16">

      <div className="w-full max-w-xl text-center space-y-10">

        {/* Hero Image (smaller) */}
        {event.image && (
          <div className="relative">
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-56 object-cover rounded-3xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-black/40 rounded-3xl" />
          </div>
        )}

        {/* Event Title */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-semibold">
            {event.name}
          </h1>

          <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">
            Find your table
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleGuestLookup} className="space-y-6">

          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-6 py-4 rounded-2xl bg-neutral-900 border border-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#d6b25e] text-white text-lg text-center"
          />

          <button
            type="submit"
            disabled={guestLoading || !guestName.trim()}
            className="w-full py-4 rounded-2xl font-semibold text-lg text-black
                       bg-gradient-to-r from-[#e6c77a] via-[#d6b25e] to-[#c9a13f]
                       shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
          >
            {guestLoading ? "..." : "Search"}
          </button>

        </form>

        {/* Result */}
        {guestResult && (
          <div className="p-8 bg-neutral-900/70 backdrop-blur-xl border border-neutral-800 rounded-3xl">

            {guestResult.found ? (
              <>
                <p className="text-neutral-500 uppercase tracking-[0.3em] text-xs mb-3">
                  Welcome
                </p>

                <p className="text-2xl font-semibold mb-6">
                  {guestResult.guest.name}
                </p>

                {guestResult.guest.table !== null ? (
                  <div className="text-5xl font-bold bg-gradient-to-r from-[#e6c77a] via-[#d6b25e] to-[#c9a13f] bg-clip-text text-transparent">
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
                Guest not found. Please try again.
              </p>
            )}

          </div>
        )}

        {/* Seating visual placeholder */}
        {guestResult?.found && guestResult.guest.table !== null && (
          <div className="mt-6 p-6 bg-neutral-900 rounded-3xl border border-neutral-800">
            <p className="text-sm text-neutral-500 mb-4 uppercase tracking-widest">
              Seating Plan
            </p>

            <div className="relative h-64 bg-black rounded-2xl">
              {event.layout.tables.map((table) => (
                <div
                  key={table.id}
                  className={`absolute w-14 h-14 rounded-full flex items-center justify-center text-sm font-semibold
                  ${table.id === guestResult.guest.table
                      ? "bg-gradient-to-r from-[#e6c77a] to-[#c9a13f] text-black"
                      : "bg-neutral-700 text-white"}`}
                  style={{
                    left: `${table.x}%`,
                    top: `${table.y}%`,
                    transform: "translate(-50%, -50%)"
                  }}
                >
                  {table.id}
                </div>
              ))}
            </div>
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