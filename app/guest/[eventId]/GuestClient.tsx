"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface Table {
  id: number;
  x: number;
  y: number;
  shape: string;
  orientation?: "horizontal" | "vertical";
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

  const leftTables = tables
    .filter(t => t.zoneId === "left")
    .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

  const centerTables = tables
    .filter(t => t.zoneId === "center")
    .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

  const rightTables = tables
    .filter(t => t.zoneId === "right")
    .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

  function renderTable(table: Table) {
    const isActive = table.id === guestResult?.found && guestResult?.guest.table === table.id;

    const shape = table.shape?.toLowerCase();
    const orientation = table.orientation ?? "horizontal";

    let shapeClasses = "";

    if (shape === "round") {
      shapeClasses = "w-14 h-14 rounded-full";
    } else if (shape === "rect") {
      shapeClasses =
        orientation === "vertical"
          ? "w-12 h-20 rounded-xl"
          : "w-20 h-12 rounded-xl";
    } else {
      shapeClasses = "w-14 h-14 rounded-full";
    }

    return (
      <div
        key={table.id}
        className={`flex items-center justify-center text-sm font-semibold transition-all
          ${shapeClasses}
          ${isActive
            ? "bg-gradient-to-br from-[#f0d78c] to-[#b8932f] text-black shadow-[0_0_25px_rgba(214,178,94,0.8)] scale-110"
            : "bg-neutral-700 text-neutral-300"
          }`}
      >
        {table.id}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-black text-white px-6 pt-8 pb-16">
      <div className="w-full max-w-xl mx-auto text-center space-y-8">

        {guestResult?.found && guestResult.guest.table !== null && (
          <div className="space-y-8">

            <div className="grid grid-cols-3 gap-8 bg-neutral-900 rounded-3xl border border-neutral-800 p-8">

              <div className="flex flex-col gap-6 items-center">
                {leftTables.map(renderTable)}
              </div>

              <div className="flex flex-col gap-6 items-center">
                {centerTables.map(renderTable)}
              </div>

              <div className="flex flex-col gap-6 items-center">
                {rightTables.map(renderTable)}
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}