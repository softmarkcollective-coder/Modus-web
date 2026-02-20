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

  // 🔥 Kun translation – ingen scaling
  const translatedTables = useMemo(() => {
    const tables = event.layout.tables;

    let minLeftEdge = Infinity;
    let minTopEdge = Infinity;

    tables.forEach((t) => {
      const halfW = t.render.widthPercent / 2;
      const halfH = t.render.heightPercent / 2;

      const leftEdge = t.render.leftPercent - halfW;
      const topEdge = t.render.topPercent - halfH;

      minLeftEdge = Math.min(minLeftEdge, leftEdge);
      minTopEdge = Math.min(minTopEdge, topEdge);
    });

    // Flyt hele layoutet så mindste kant rammer 0
    const offsetX = minLeftEdge < 0 ? -minLeftEdge : 0;
    const offsetY = minTopEdge < 0 ? -minTopEdge : 0;

    return tables.map((t) => ({
      ...t,
      adjustedLeft: t.render.leftPercent + offsetX,
      adjustedTop: t.render.topPercent + offsetY
    }));
  }, [event]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-black text-white px-6 pt-8 pb-16">
      <div className="w-full max-w-xl mx-auto text-center space-y-8">

        {guestResult?.found && guestResult.guest.table !== null && (
          <div className="space-y-8">

            <div className="p-6 bg-neutral-900 rounded-3xl border border-neutral-800">
              <div className="w-full flex justify-center">
                <div
                  className="relative w-full max-w-[375px] mx-auto bg-black rounded-2xl overflow-visible"
                  style={{ aspectRatio }}
                >
                  {translatedTables.map((table) => {

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
                          left: `${table.adjustedLeft}%`,
                          top: `${table.adjustedTop}%`,
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