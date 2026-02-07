"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

type GuestResult = {
  found: boolean;
  event?: {
    name: string;
    welcomeText?: string;
    imageUrl?: string;
  };
  result?: {
    table: number;
  };
};

export default function GuestClient() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId");

  const [name, setName] = useState("");
  const [data, setData] = useState<GuestResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!name || !eventId) return;

    setLoading(true);
    setError(null);
    setData(null);

    const res = await fetch(
      `/api/guest?name=${encodeURIComponent(name)}&eventId=${encodeURIComponent(eventId)}`
    );

    const json: GuestResult = await res.json();

    if (!json.found) {
      setError(
        "We couldn't find your name on the guest list. Please check the spelling or contact the host."
      );
      setLoading(false);
      return;
    }

    setData(json);
    setLoading(false);
  }

  return (
    <div className="guest-wrapper">
      <h1>Find your table</h1>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name (as on the guest list)"
      />

      <button onClick={handleSubmit} disabled={loading}>
        Show my table
      </button>

      {error && <p className="error">{error}</p>}

      {data?.found && (
        <div className="result">
          <p>Your table number:</p>
          <strong>{data.result?.table}</strong>
        </div>
      )}
    </div>
  );
}