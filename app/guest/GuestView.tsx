"use client";

import { useState } from "react";

export default function GuestView() {
  const [name, setName] = useState("");
  const [result, setResult] = useState<null | {
    table: number;
    seat: number;
    total: number;
  }>(null);

  function handleSubmit() {
    // midlertidigt mock – API kobler vi på bagefter
    setResult({ table: 1, seat: 2, total: 5 });
  }

  return (
    <main style={{ maxWidth: 420, margin: "0 auto", padding: "2rem" }}>
      <p style={{ opacity: 0.6, letterSpacing: 1 }}>MY EVENT</p>

      <h1 style={{ fontSize: 36, marginTop: 8 }}>Find your seat</h1>

      {!result && (
        <>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            style={{
              width: "100%",
              padding: "14px",
              marginTop: 24,
              borderRadius: 12,
              border: "none",
              background: "#1b2220",
              color: "#fff",
              fontSize: 16,
            }}
          />

          <button
            onClick={handleSubmit}
            style={{
              width: "100%",
              marginTop: 16,
              padding: "14px",
              borderRadius: 12,
              border: "none",
              background: "#1b2220",
              color: "#e8e8e8",
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            Show my table
          </button>
        </>
      )}

      {result && (
        <>
          <p style={{ marginTop: 32, opacity: 0.7 }}>You are seated at</p>

          <h2 style={{ fontSize: 40, color: "#c9b27c" }}>
            Table {result.table}
          </h2>

          <p style={{ opacity: 0.7 }}>
            Seat {result.seat} of {result.total}
          </p>
        </>
      )}
    </main>
  );
}