"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface Table {
  id: number;
  x: number;
  y: number;
  shape: string;
  orientation?: string;
  size?: number;
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

  const maxX = Math.max(...event.layout.tables.map(t => t.x));
  const maxY = Math.max(...event.layout.tables.map(t => t.y));

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-black text-white px-6 pt-8 pb-16">
      <div className="w-full max-w-xl mx-auto text-center space-y-8">

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
                       bg-gradient-to-r from-[#f0d78c] via-[#d6b25e] to-[#b8932f]"
          >
            {guestLoading ? "..." : "Show my table"}
          </button>
        </form>

        {guestResult?.found && guestResult.guest.table !== null && (
          <div className="space-y-8">

            <div className="p-8 bg-neutral-900/70 border border-neutral-800 rounded-3xl">
              <div className="text-5xl font-bold text-[#d6b25e]">
                Table {guestResult.guest.table}
              </div>
            </div>

            <div className="p-6 bg-neutral-900 rounded-3xl border border-neutral-800">
              <div className="relative h-72 bg-black rounded-2xl">

                {event.layout.tables.map((table) => {

                  const isActive = table.id === guestResult.guest.table;

                  const left = maxX === 0 ? 50 : (table.x / maxX) * 100;
                  const top = maxY === 0 ? 50 : (table.y / maxY) * 100;

                  let width = 56;
                  let height = 56;

                  if (table.shape === "round") {
                    width = 56;
                    height = 56;
                  }

                  if (table.shape === "rect") {
                    const sizeMultiplier =
                      table.size === 3 ? 1.6 :
                      table.size === 2 ? 1.3 : 1;

                    if (table.orientation === "horizontal") {
                      width = 80 * sizeMultiplier;
                      height = 48;
                    }

                    if (table.orientation === "vertical") {
                      width = 48;
                      height = 80 * sizeMultiplier;
                    }
                  }

                  return (
                    <div
                      key={table.id}
                      className={`absolute flex items-center justify-center text-sm font-semibold rounded-xl
                        ${isActive
                          ? "bg-[#d6b25e] text-black"
                          : "bg-neutral-700 text-neutral-300"
                        }`}
                      style={{
                        left: `${left}%`,
                        top: `${top}%`,
                        width: `${width}px`,
                        height: `${height}px`,
                        transform: "translate(-50%, -50%)"
                      }}
                    >
                      {table.id}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}