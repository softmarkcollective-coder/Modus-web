"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function GuestClient() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId");

  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!eventId) {
      setError("Invalid event link. Please contact the host.");
      return;
    }

    const res = await fetch(
      `/api/guest?name=${encodeURIComponent(name)}&eventId=${eventId}`
    );

    const json = await res.json();

    if (!json.found) {
      setResult(null);
      setError(
        "We couldn't find your name on the guest list. Please check the spelling or contact the host."
      );
      return;
    }

    setResult(json);
  }

  return (
    <div>
      {!result && (
        <form onSubmit={handleSubmit}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (as on the guest list)"
          />
          <button type="submit">Show my table</button>
          {error && <p>{error}</p>}
        </form>
      )}

      {result && (
        <div>
          {/* HER vises bord/seat-resultatet */}
        </div>
      )}
    </div>
  );
}