"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface Table {
  id: number;
  x: number;
  y: number;
  shape: string;
  orientation?: "horizontal" | "vertical";
  size?: number;
  render: {
    leftPercent: number;
    topPercent: number;
    widthPercent: number;
    heightPercent: number;
  };
}

interface EventData {
  id: string;
  name: string;
  image: string | null;
  hostMessage?: string | null;
  menu?: string[] | null;
  menuTitle?: string | null;
  layout: {
    tables: Table[];
    metadata?: {
      aspectRatio?: number;
    };
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
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

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
        const res = await fetch(
          `${API_BASE}/api/public/event/${eventId}`,
          { cache: "no-store" }
        );

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
  }, [eventId, API_BASE]);

  async function handleGuestLookup(e: React.FormEvent) {
    e.preventDefault();
    if (!guestName.trim()) return;

    setGuestLoading(true);
    setGuestResult(null);

    try {
      const res = await fetch(
        `${API_BASE}/api/public/event/${eventId}/guest?name=${encodeURIComponent(
          guestName.trim()
        )}`,
        { cache: "no-store" }
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

  const aspectRatio = event.layout.metadata?.aspectRatio ?? 1;
  const FRAME_PADDING = 4;

  // 🔥 GLOBAL PROPORTIONAL SCALE
  const tables = event.layout.tables;

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  tables.forEach((t) => {
    const left = t.render.leftPercent - t.render.widthPercent / 2;
    const right = t.render.leftPercent + t.render.widthPercent / 2;
    const top = t.render.topPercent - t.render.heightPercent / 2;
    const bottom = t.render.topPercent + t.render.heightPercent / 2;

    minX = Math.min(minX, left);
    maxX = Math.max(maxX, right);
    minY = Math.min(minY, top);
    maxY = Math.max(maxY, bottom);
  });

  const layoutWidth = maxX - minX;
  const layoutHeight = maxY - minY;
  const available = 100 - FRAME_PADDING * 2;

  const scale =
    layoutWidth > 0 && layoutHeight > 0
      ? Math.min(available / layoutWidth, available / layoutHeight, 1)
      : 1;

  const columns = Array.from(
    new Set(tables.map((t) => t.x))
  ).sort((a, b) => a - b);

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
              <p className="text-xs text-neutral-500 mb-4 uppercase tracking-widest">
                Seating Layout
              </p>

              <div className="relative w-full bg-black rounded-2xl overflow-hidden" style={{ aspectRatio }}>

                {columns.map((col) =>
                  tables
                    .filter((t) => t.x === col)
                    .sort((a, b) => a.y - b.y)
                    .map((table) => {

                      const isActive = table.id === guestResult.guest.table;

                      const scaledLeft =
                        FRAME_PADDING +
                        (table.render.leftPercent - minX) * scale;

                      const scaledTop =
                        FRAME_PADDING +
                        (table.render.topPercent - minY) * scale;

                      return (
                        <div
                          key={table.id}
                          className={`absolute flex items-center justify-center text-sm font-semibold transition-all ring-1 ring-black/40
                            ${table.shape === "round" ? "rounded-full" : "rounded-xl"}
                            ${isActive
                              ? "bg-gradient-to-br from-[#f0d78c] to-[#b8932f] text-black shadow-[0_0_25px_rgba(214,178,94,0.8)]"
                              : "bg-neutral-700 text-neutral-300"
                            }`}
                          style={{
                            left: `${scaledLeft}%`,
                            top: `${scaledTop}%`,
                            width: `${table.render.widthPercent * scale}%`,
                            height: `${table.render.heightPercent * scale}%`,
                            transform: "translate(-50%, -50%)",
                            zIndex: isActive ? 10 : 1
                          }}
                        >
                          {table.id}
                        </div>
                      );
                    })
                )}

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
                  {event.menuTitle ?? "Menu"}
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