"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface Table {
  id: number;
  x: number;
  y: number;
  shape: string;
  orientation?: "horizontal" | "vertical";
  length?: number; // 👈 supports 1,2,3 like iOS app
}

interface EventData {
  id: string;
  name: string;
  image: string | null;
  hostMessage?: string | null;
  menu?: string[] | null;
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
  const [notFound, setNotFound] = useState(false);

  const [guestName, setGuestName] = useState("");
  const [guestResult, setGuestResult] = useState<GuestResponse | null>(null);
  const [guestLoading, setGuestLoading] = useState(false);

  /* ---------------- EVENT FETCH ---------------- */

  useEffect(() => {
    if (!eventId) return;

    async function fetchEvent() {
      try {
        const res = await fetch(`/api/guest/event/${eventId}`, {
          cache: "no-store",
        });

        if (res.status === 404) {
          setNotFound(true);
          return;
        }

        const data = (await res.json()) as EventData;
        setEvent(data);
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
    setGuestResult(null);

    try {
      const res = await fetch(
        `/api/guest/event/${eventId}/guest?name=${encodeURIComponent(
          guestName.trim()
        )}`,
        { cache: "no-store" }
      );

      const data = (await res.json()) as GuestResponse;
      setGuestResult(data);

      // refresh event for live updates
      const refreshed = await fetch(`/api/guest/event/${eventId}`, {
        cache: "no-store",
      });
      const refreshedData = (await refreshed.json()) as EventData;
      setEvent(refreshedData);

    } finally {
      setGuestLoading(false);
    }
  }

  if (loading || !event) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        Loading event...
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        Event unavailable
      </div>
    );
  }

  const tables = event.layout.tables ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-black text-white px-6 pt-8 pb-16">
      <div className="w-full max-w-xl mx-auto text-center space-y-8">

        {/* Hero Image — ALWAYS render if present */}
        {event.image && (
          <div className="relative">
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-52 object-cover rounded-3xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-black/40 rounded-3xl" />
          </div>
        )}

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">
            {event.name}
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold">
            Find your seat
          </h1>
        </div>

        {/* Search */}
        <form onSubmit={handleGuestLookup} className="space-y-5">
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-6 py-4 rounded-2xl bg-neutral-900 border border-neutral-800
                       focus:outline-none focus:ring-2 focus:ring-[#d6b25e]
                       text-white text-lg text-center"
          />

          <button
            type="submit"
            disabled={guestLoading || !guestName.trim()}
            className="w-full py-4 rounded-2xl font-semibold text-lg text-black
                       bg-gradient-to-r from-[#f0d78c] via-[#d6b25e] to-[#b8932f]
                       shadow-[0_10px_30px_rgba(214,178,94,0.35)]
                       hover:scale-[1.02] active:scale-95 transition-all"
          >
            {guestLoading ? "..." : "Show my table"}
          </button>
        </form>

        {guestResult?.found && guestResult.guest.table !== null && (
          <div className="space-y-8">

            {/* Highlight */}
            <div className="p-8 bg-neutral-900/70 backdrop-blur-xl border border-neutral-800 rounded-3xl">
              <p className="text-neutral-400 uppercase tracking-[0.3em] text-xs mb-3">
                You are seated at
              </p>
              <div className="text-5xl font-bold bg-gradient-to-r from-[#f0d78c] via-[#d6b25e] to-[#b8932f] bg-clip-text text-transparent">
                Table {guestResult.guest.table}
              </div>
            </div>

            {/* Seating Plan */}
            <div className="p-6 bg-neutral-900 rounded-3xl border border-neutral-800">
              <p className="text-xs text-neutral-500 mb-6 uppercase tracking-widest">
                Seating Plan
              </p>

              <div className="bg-black rounded-2xl p-8">
                {(() => {
                  const columns: Record<number, Table[]> = {};

                  tables.forEach((t) => {
                    if (!columns[t.x]) columns[t.x] = [];
                    columns[t.x].push(t);
                  });

                  const sortedX = Object.keys(columns)
                    .map(Number)
                    .sort((a, b) => a - b);

                  sortedX.forEach((x) => {
                    columns[x].sort((a, b) => a.y - b.y);
                  });

                  return (
                    <div className="flex justify-between items-start gap-16">

                      {sortedX.map((x) => {
                        const isCenter = x === 1;

                        return (
                          <div
                            key={x}
                            className={`flex ${
                              isCenter
                                ? "flex-row items-center justify-center gap-6"
                                : "flex-col items-center gap-6"
                            }`}
                          >
                            {columns[x].map((table) => {

                              const isActive =
                                guestResult.guest.table === table.id;

                              const length = table.length ?? 1;

                              const baseRound = 56;
                              const baseRectShort = 48;
                              const baseRectLong = 80;

                              const sizeMultiplier = length;

                              let width = 56;
                              let height = 56;

                              if (table.shape === "round") {
                                width = baseRound;
                                height = baseRound;
                              } else if (table.shape === "rect") {
                                if (table.orientation === "horizontal") {
                                  width = baseRectLong * sizeMultiplier;
                                  height = baseRectShort;
                                } else {
                                  width = baseRectShort;
                                  height = baseRectLong * sizeMultiplier;
                                }
                              }

                              return (
                                <div
                                  key={table.id}
                                  style={{
                                    width,
                                    height,
                                  }}
                                  className={`flex items-center justify-center text-sm font-semibold rounded-xl transition-all
                                    ${
                                      table.shape === "round"
                                        ? "rounded-full"
                                        : ""
                                    }
                                    ${
                                      isActive
                                        ? "bg-gradient-to-br from-[#f0d78c] to-[#b8932f] text-black shadow-[0_0_30px_rgba(214,178,94,0.8)] scale-110"
                                        : "bg-neutral-700 text-neutral-300"
                                    }`}
                                >
                                  {table.id}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>

            {event.hostMessage && (
              <div className="p-6 bg-neutral-900 rounded-3xl border border-neutral-800 text-neutral-300 text-sm">
                {event.hostMessage}
              </div>
            )}

            {event.menu && event.menu.length > 0 && (
              <div className="p-6 bg-neutral-900 rounded-3xl border border-neutral-800 text-left">
                <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-[#f0d78c] to-[#b8932f] bg-clip-text text-transparent">
                  Menu
                </h3>
                <ul className="space-y-3 text-neutral-300">
                  {event.menu.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="text-neutral-600 text-sm">
          {tables.length} tables at this event
        </div>
      </div>
    </div>
  );
}