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

  let minLeft = Infinity;
  let maxRight = -Infinity;
  let minTop = Infinity;
  let maxBottom = -Infinity;

  event.layout.tables.forEach((t) => {
    const halfW = t.render.widthPercent / 2;
    const halfH = t.render.heightPercent / 2;

    minLeft = Math.min(minLeft, t.render.leftPercent - halfW);
    maxRight = Math.max(maxRight, t.render.leftPercent + halfW);
    minTop = Math.min(minTop, t.render.topPercent - halfH);
    maxBottom = Math.max(maxBottom, t.render.topPercent + halfH);
  });

  const layoutWidth = maxRight - minLeft;
  const layoutHeight = maxBottom - minTop;

  const SAFE_PERCENT = 90;

  const scale = Math.min(
    SAFE_PERCENT / layoutWidth,
    SAFE_PERCENT / layoutHeight,
    1
  );

  const offsetX = (100 - layoutWidth * scale) / 2 - (minLeft * scale);
  const offsetY = (100 - layoutHeight * scale) / 2 - (minTop * scale);

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
                  {event.layout.tables.map((table, index) => {

                    const isActive = table.id === guestResult.guest.table;

                    let width = table.render.widthPercent * scale;
                    let height = table.render.heightPercent * scale;

                    // 🔥 Overlap protection (horizontal only)
                    event.layout.tables.forEach((other) => {
                      if (other.id === table.id) return;

                      const distanceX =
                        Math.abs(other.render.leftPercent - table.render.leftPercent) * scale;

                      const minDistance =
                        (width + other.render.widthPercent * scale) / 2;

                      if (distanceX < minDistance) {
                        width = (distanceX * 2) - (other.render.widthPercent * scale);
                      }
                    });

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
                          left: `${table.render.leftPercent * scale + offsetX}%`,
                          top: `${table.render.topPercent * scale + offsetY}%`,
                          width: `${width}%`,
                          height: `${height}%`,
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