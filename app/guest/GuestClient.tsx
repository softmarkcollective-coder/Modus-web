"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

type GuestResult = {
  event: {
    name: string;
    welcomeText?: string;
    imageUrl?: string;
  };
  result: {
    table: number;
  };
};

export default function GuestClient() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId");

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<GuestResult | null>(null);

  async function handleSubmit() {
    if (!name.trim() || !eventId) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(
        `/api/guest?name=${encodeURIComponent(name.trim())}&eventId=${eventId}`
      );

      const json = await res.json();

      if (!json.found) {
        setError(
          "We couldn’t find your name on the guest list. Please check the spelling or contact the host."
        );
        return;
      }

      setData(json);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(1200px 600px at 50% -10%, #2a2f2c 0%, #141615 60%)",
        color: "#f5f5f5",
        padding: 24,
      }}
    >
      <section style={{ width: "100%", maxWidth: 520, textAlign: "center" }}>
        {!data && (
          <>
            <p
              style={{
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                opacity: 0.6,
                fontSize: 12,
                marginBottom: 8,
              }}
            >
              My event
            </p>

            <h1 style={{ fontSize: 32, marginBottom: 32, fontWeight: 500 }}>
              Find your table
            </h1>

            <div
              style={{
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: 14,
                padding: 6,
                marginBottom: 20,
              }}
            >
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name (as on the guest list)"
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#fff",
                  fontSize: 16,
                  padding: "12px 14px",
                }}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !eventId}
              style={{
                borderRadius: 999,
                padding: "14px 28px",
                fontSize: 15,
                fontWeight: 600,
                background:
                  "linear-gradient(135deg, #f6e6b4 0%, #e5c97b 45%, #c9a84a 100%)",
                border: "none",
                cursor: "pointer",
              }}
            >
              {loading ? "Finding your table…" : "Show my table"}
            </button>

            {error && (
              <p style={{ marginTop: 24, opacity: 0.75 }}>{error}</p>
            )}
          </>
        )}

        {data && (
          <>
            <p style={{ opacity: 0.6 }}>You are seated at</p>
            <h2 style={{ fontSize: 36, color: "#e5c97b" }}>
              Table {data.result.table}
            </h2>
          </>
        )}
      </section>
    </main>
  );
}