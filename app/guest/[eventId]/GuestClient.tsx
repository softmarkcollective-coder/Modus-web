"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import LayoutRenderer from "./layouts/LayoutRenderer";

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
  menuType?: "menu" | "agenda" | null;
  layout: {
    type?: string | null;
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
  suggestions?: { name: string }[]; // ✅ added
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

  async function lookup(name: string) {
    setGuestLoading(true);
    setGuestResult(null);

    try {
      const res = await fetch(
        `${API_BASE}/api/public/event/${eventId}/guest?name=${encodeURIComponent(
          name.trim()
        )}`,
        { cache: "no-store" }
      );

      const data = (await res.json()) as GuestResponse;
      setGuestResult(data);
    } finally {
      setGuestLoading(false);
    }
  }

  async function handleGuestLookup(e: React.FormEvent) {
    e.preventDefault();
    if (!guestName.trim()) return;
    lookup(guestName);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-black text-white px-6 pt-8 pb-16">
      <div className="w-full max-w-lg mx-auto text-center space-y-8">

        {event.image && (
          <div>
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-64 object-cover rounded-3xl shadow-2xl"
            />
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
            placeholder="Type your name here"
            className="w-full px-6 py-4 rounded-2xl bg-neutral-900 border border-neutral-800
                       focus:outline-none focus:ring-2 focus:ring-[#d6b25e]
                       text-white text-lg text-center"
          />

          <button
            type="submit"
            disabled={guestLoading || !guestName.trim()}
            className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all
              ${
                guestLoading || !guestName.trim()
                  ? "bg-neutral-700 text-neutral-400 cursor-not-allowed"
                  : "text-black bg-gradient-to-r from-[#f0d78c] via-[#d6b25e] to-[#b8932f] shadow-[0_10px_30px_rgba(214,178,94,0.35)] hover:scale-[1.02] active:scale-95"
              }`}
          >
            {guestLoading ? "Searching..." : "Find my seat"}
          </button>
        </form>

        {/* Exact match with table */}
        {guestResult?.found && guestResult.guest.table !== null && (
          <div className="space-y-8">

            <div className="p-8 bg-neutral-900/70 backdrop-blur-xl border border-neutral-800 rounded-3xl">
              <p className="text-neutral-400 uppercase tracking-[0.3em] text-xs mb-3">
                Welcome, {guestResult.guest.name}
              </p>
              <div className="text-5xl font-bold bg-gradient-to-r from-[#f0d78c] via-[#d6b25e] to-[#b8932f] bg-clip-text text-transparent">
                Table {guestResult.guest.table}
              </div>
            </div>

            <div className="p-6 bg-neutral-900 rounded-3xl border border-neutral-800">
              <p className="text-xs text-neutral-500 mb-4 uppercase tracking-[0.25em]">
                Seating Layout
              </p>

              <LayoutRenderer
                type={event.layout?.type ?? "custom"}
                tables={event.layout?.tables ?? []}
                activeTableId={guestResult.guest.table}
                metadata={event.layout?.metadata}
              />
            </div>

            {event.hostMessage && (
              <div className="p-6 bg-neutral-900 rounded-3xl border border-neutral-800 text-neutral-300 text-sm">
                {event.hostMessage}
              </div>
            )}

            {event.menu && event.menu.length > 0 && (
              <div className="p-6 bg-neutral-900 rounded-3xl border border-neutral-800 text-left">
                <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-[#f0d78c] to-[#b8932f] bg-clip-text text-transparent">
                  {event.menuTitle ?? (event.menuType === "agenda" ? "Agenda" : "Menu")}
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

        {/* Guest found but no table */}
        {guestResult?.found && guestResult.guest.table === null && (
          <div className="p-6 bg-neutral-900 rounded-3xl border border-neutral-800 text-neutral-400 text-sm space-y-2">
            <p className="font-medium text-white">
              You're on the guest list 🎉
            </p>
            <p>
              Your table hasn’t been assigned yet. Please check with the host.
            </p>
          </div>
        )}

        {/* Multiple matches */}
        {guestResult &&
          !guestResult.found &&
          guestResult.suggestions &&
          guestResult.suggestions.length > 0 && (
            <div className="p-6 bg-neutral-900 rounded-3xl border border-neutral-800 text-left space-y-4">
              <p className="text-white font-medium">
                We found multiple guests. Please choose your name:
              </p>
              <ul className="space-y-2">
                {guestResult.suggestions.map((s, index) => (
                  <li key={index}>
                    <button
                      onClick={() => {
                        setGuestName(s.name);
                        lookup(s.name);
                      }}
                      className="w-full text-left px-4 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 transition"
                    >
                      {s.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

        {/* No match at all */}
        {guestResult &&
          !guestResult.found &&
          (!guestResult.suggestions ||
            guestResult.suggestions.length === 0) && (
            <div className="p-6 bg-neutral-900 rounded-3xl border border-neutral-800 text-neutral-400 text-sm space-y-2">
              <p className="font-medium text-white">
                We couldn’t find that name.
              </p>
              <p>
                Please check the spelling and try again.
              </p>
            </div>
          )}

        <div className="text-neutral-600 text-sm">
          {(event.layout?.tables ?? []).length} tables at this event
        </div>

      </div>
    </div>
  );
}