"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface Table {
  id: number;
  x: number;
  y: number;
  shape: string;
  orientation?: "horizontal" | "vertical";
  length?: number;
  zoneId?: "left" | "center" | "right" | null;
  orderIndex?: number | null;
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
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [eventId]);

  async function handleGuestLookup(e: React.FormEvent) {
    e.preventDefault();
    if (!guestName.trim()) return;

    setGuestLoading(true);
    setGuestResult(null);

    try {
      const res = await fetch(
        `/api/guest/event/${eventId}/guest?name=${encodeURIComponent(
          guestName.trim()
        )}`
      );

      const data = (await res.json()) as GuestResponse;
      setGuestResult(data);
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

  const tables = event.layout.tables;

  const hasZoneLayout = tables.some(t => t.zoneId);

  const maxX = Math.max(...tables.map(t => t.x));
  const maxY = Math.max(...tables.map(t => t.y));

  const RECT_BASE_SIZE = 56;

  function renderTable(table: Table) {
    const isActive = 
    guestResult?.found === true &&
    guestResult.guest.table === table.id;

    const isRound = table.shape === "round";
    const isVertical = table.orientation === "vertical";
    const tableLength = Math.min(table.length ?? 1, 6);

    let width = RECT_BASE_SIZE;
    let height = RECT_BASE_SIZE;
    let borderRadius = 4;

    if (isRound) {
      width = RECT_BASE_SIZE;
      height = RECT_BASE_SIZE;
      borderRadius = width / 2;
    } else if (isVertical) {
      width = RECT_BASE_SIZE;
      height = RECT_BASE_SIZE * tableLength;
    } else {
      width = RECT_BASE_SIZE * tableLength;
      height = RECT_BASE_SIZE;
    }

    return (
      <div
        key={table.id}
        className={`flex items-center justify-center text-sm font-semibold transition-all
          ${isActive
            ? "bg-gradient-to-br from-[#f0d78c] to-[#b8932f] text-black shadow-[0_0_25px_rgba(214,178,94,0.8)] scale-110"
            : "bg-neutral-700 text-neutral-300"
          }`}
        style={{
          width,
          height,
          borderRadius
        }}
      >
        {table.id}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-black text-white px-6 pt-8 pb-16">
      <div className="w-full max-w-xl mx-auto text-center space-y-8">

        {event.image && event.image.startsWith("http") && (
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

            <div className="p-8 bg-neutral-900/70 backdrop-blur-xl border border-neutral-800 rounded-3xl">
              <p className="text-neutral-400 uppercase tracking-[0.3em] text-xs mb-3">
                You are seated at
              </p>
              <div className="text-5xl font-bold bg-gradient-to-r from-[#f0d78c] via-[#d6b25e] to-[#b8932f] bg-clip-text text-transparent">
                Table {guestResult.guest.table}
              </div>
            </div>

            <div className="p-6 bg-neutral-900 rounded-3xl border border-neutral-800">
              <p className="text-xs text-neutral-500 mb-6 uppercase tracking-widest">
                Seating Plan
              </p>

              {!hasZoneLayout && (
                <div className="relative h-72 bg-black rounded-2xl">
                  {tables.map((table) => {
                    const left = maxX === 0 ? 50 : (table.x / maxX) * 100;
                    const top = maxY === 0 ? 50 : (table.y / maxY) * 100;

                    return (
                      <div
                        key={table.id}
                        className="absolute"
                        style={{
                          left: `${left}%`,
                          top: `${top}%`,
                          transform: "translate(-50%, -50%)"
                        }}
                      >
                        {renderTable(table)}
                      </div>
                    );
                  })}
                </div>
              )}

              {hasZoneLayout && (
                <div className="flex justify-between gap-6 bg-black rounded-2xl p-6">
                  {["left", "center", "right"].map(zone => (
                    <div key={zone} className="flex flex-col gap-4 items-center flex-1">
                      {tables
                        .filter(t => t.zoneId === zone)
                        .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
                        .map(renderTable)}
                    </div>
                  ))}
                </div>
              )}

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