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

  const tables = event.layout.tables;

  // 🔥 Dynamiske kolonner
  const columns = Array.from(
    new Set(tables.map((t) => t.x))
  ).sort((a, b) => a - b);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-black text-white px-6 pt-8 pb-16">
      <div className="w-full max-w-xl mx-auto text-center space-y-8">

        {/* ... header + form unchanged ... */}

        {guestResult?.found && guestResult.guest.table !== null && (
          <div className="space-y-8">

            <div className="p-6 bg-neutral-900 rounded-3xl border border-neutral-800">
              <p className="text-xs text-neutral-500 mb-4 uppercase tracking-widest">
                Seating Layout
              </p>

              <div
                className="relative w-full bg-black rounded-2xl overflow-hidden"
                style={{ aspectRatio }}
              >

                {columns.map((col) => {
                  const columnTables = tables
                    .filter((t) => t.x === col)
                    .sort((a, b) => a.render.topPercent - b.render.topPercent);

                  let lastBottom = -Infinity;

                  return columnTables.map((table) => {

                    const isActive =
                      table.id === guestResult.guest.table;

                    const halfHeight =
                      table.render.heightPercent / 2;

                    let adjustedTop =
                      table.render.topPercent;

                    const topEdge =
                      adjustedTop - halfHeight;

                    if (topEdge < lastBottom) {
                      adjustedTop =
                        lastBottom + halfHeight;
                    }

                    lastBottom =
                      adjustedTop + halfHeight;

                    return (
                      <div
                        key={table.id}
                        className={`absolute flex items-center justify-center text-sm font-semibold transition-all ring-1 ring-black/40
                          ${table.shape === "round"
                            ? "rounded-full"
                            : "rounded-xl"}
                          ${isActive
                            ? "bg-gradient-to-br from-[#f0d78c] to-[#b8932f] text-black shadow-[0_0_25px_rgba(214,178,94,0.8)]"
                            : "bg-neutral-700 text-neutral-300"}
                        `}
                        style={{
                          left: `${table.render.leftPercent}%`,
                          top: `${adjustedTop}%`,
                          width: `${table.render.widthPercent}%`,
                          height: `${table.render.heightPercent}%`,
                          transform: "translate(-50%, -50%)",
                          zIndex: isActive ? 10 : 1,
                        }}
                      >
                        {table.id}
                      </div>
                    );
                  });
                })}

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}