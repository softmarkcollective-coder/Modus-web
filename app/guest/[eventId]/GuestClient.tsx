"use client";

import { useState, useEffect, useMemo } from "react";
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
        const res = await fetch(`/api/guest/event/${eventId}`, {
          cache: "no-store"
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

  // 🔥 NORMALISER HELE LAYOUTET (ingen hardcode, ingen gæt)
  const normalizedTables = useMemo(() => {
    const tables = event.layout.tables;

    let minLeft = Infinity;
    let maxRight = -Infinity;
    let minTop = Infinity;
    let maxBottom = -Infinity;

    tables.forEach((t) => {
      const halfW = t.render.widthPercent / 2;
      const halfH = t.render.heightPercent / 2;

      const leftEdge = t.render.leftPercent - halfW;
      const rightEdge = t.render.leftPercent + halfW;
      const topEdge = t.render.topPercent - halfH;
      const bottomEdge = t.render.topPercent + halfH;

      minLeft = Math.min(minLeft, leftEdge);
      maxRight = Math.max(maxRight, rightEdge);
      minTop = Math.min(minTop, topEdge);
      maxBottom = Math.max(maxBottom, bottomEdge);
    });

    const widthSpan = maxRight - minLeft;
    const heightSpan = maxBottom - minTop;

    return tables.map((t) => {
      const halfW = t.render.widthPercent / 2;
      const halfH = t.render.heightPercent / 2;

      const leftEdge = t.render.leftPercent - halfW;
      const topEdge = t.render.topPercent - halfH;

      const normalizedLeft =
        ((leftEdge - minLeft) / widthSpan) * 100 + halfW;

      const normalizedTop =
        ((topEdge - minTop) / heightSpan) * 100 + halfH;

      return {
        ...t,
        normalizedLeft,
        normalizedTop
      };
    });
  }, [event]);

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
                       bg-gradient-to-r from-[#f0d78c] via-[#d6b25e] to-[#b8932f]
                       shadow-[0_10px_30px_rgba(214,178,94,0.35)]
                       hover:scale-[1.02] active:scale-95 transition-all"
          >
            {guestLoading ? "..." : "Show my table"}
          </button>
        </form>

        {guestResult?.found && guestResult.guest.table !== null && (
          <div className="space-y-8">

            <div className="p-6 bg-neutral-900 rounded-3xl border border-neutral-800">
              <div className="w-full flex justify-center">
                <div
                  className="relative w-full max-w-[375px] mx-auto bg-black rounded-2xl overflow-visible"
                  style={{ aspectRatio }}
                >
                  {normalizedTables.map((table) => {

                    const isActive =
                      table.id === guestResult.guest.table;

                    return (
                      <div
                        key={table.id}
                        className={`absolute flex items-center justify-center text-sm font-semibold
                          ${table.shape === "round" ? "rounded-full" : "rounded-xl"}
                          ${isActive
                            ? "bg-gradient-to-br from-[#f0d78c] to-[#b8932f] text-black"
                            : "bg-neutral-700 text-neutral-300"
                          }`}
                        style={{
                          left: `${table.normalizedLeft}%`,
                          top: `${table.normalizedTop}%`,
                          width: `${table.render.widthPercent}%`,
                          height: `${table.render.heightPercent}%`,
                          transform: "translate(-50%, -50%)",
                          zIndex: isActive ? 10 : 1
                        }}
                      >
                        {table.id}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}