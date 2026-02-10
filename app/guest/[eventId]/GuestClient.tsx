"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_VIBECODE_API_BASE;

interface Table {
  id: number;
  x: number;
  y: number;
  shape: string;
}

interface EventData {
  id: string;
  name: string;
  image: string | null;
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
type EventError = { error: string };

export default function GuestClient() {
  const params = useParams();
  const eventId = params.eventId as string;

  /* ✅ VIGTIG RETTELSE – ENV GUARD */
  if (!BASE_URL) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-600">
          Missing NEXT_PUBLIC_VIBECODE_API_BASE
        </p>
      </div>
    );
  }

  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [guestName, setGuestName] = useState("");
  const [guestResult, setGuestResult] = useState<GuestResponse | null>(null);
  const [guestLoading, setGuestLoading] = useState(false);
  const [guestError, setGuestError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;

    async function fetchEvent() {
      setLoading(true);
      setError(null);
      setNotFound(false);

      try {
        const res = await fetch(`${BASE_URL}/api/public/event/${eventId}`);

        if (res.status === 404) {
          setNotFound(true);
          return;
        }

        if (res.status === 400) {
          const data = (await res.json()) as EventError;
          setError(data.error || "Bad request");
          return;
        }

        if (!res.ok) {
          setError(`Server error: ${res.status}`);
          return;
        }

        const data = (await res.json()) as EventData;
        setEvent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Network error");
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
    setGuestError(null);
    setGuestResult(null);

    try {
      const res = await fetch(
        `${BASE_URL}/api/public/event/${eventId}/guest?name=${encodeURIComponent(
          guestName.trim()
        )}`
      );

      if (!res.ok) {
        setGuestError(`Server error: ${res.status}`);
        return;
      }

      const data = (await res.json()) as GuestResponse;
      setGuestResult(data);
    } catch (err) {
      setGuestError(err instanceof Error ? err.message : "Network error");
    } finally {
      setGuestLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading event...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-600">Event not found</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-600">No event data</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        {event.image && (
          <img
            src={event.image}
            alt={event.name}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        )}

        <h1 className="text-2xl font-bold mb-6 text-center">{event.name}</h1>

        <form onSubmit={handleGuestLookup} className="mb-6">
          <label htmlFor="guestName" className="block text-sm font-medium mb-2">
            Find your table
          </label>
          <div className="flex gap-2">
            <input
              id="guestName"
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Enter your name"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
            />
            <button
              type="submit"
              disabled={guestLoading || !guestName.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
            >
              {guestLoading ? "..." : "Search"}
            </button>
          </div>
        </form>

        {guestError && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-4">
            Error: {guestError}
          </div>
        )}

        {guestResult && (
          <div className="p-4 bg-white rounded-lg shadow">
            {guestResult.found ? (
              <div className="text-center">
                <p className="text-lg font-medium">{guestResult.guest.name}</p>
                {guestResult.guest.table !== null ? (
                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    Table {guestResult.guest.table}
                  </p>
                ) : (
                  <p className="text-gray-500 mt-2">No table assigned</p>
                )}
              </div>
            ) : (
              <p className="text-center text-gray-600">
                Guest not found. Please check your name and try again.
              </p>
            )}
          </div>
        )}

        <div className="mt-8">
          <p className="text-sm text-gray-500 text-center">
            {event.layout.tables.length} tables at this event
          </p>
        </div>
      </div>
    </div>
  );
}