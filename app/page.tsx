"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [name, setName] = useState("");
  const router = useRouter();

  function submit() {
    if (!name.trim()) return;
    router.push(`/guest?name=${encodeURIComponent(name)}`);
  }

  return (
    <main className="screen">
      <div className="event-label">MY EVENT</div>
      <h1>Find your seat</h1>

      <input
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button onClick={submit}>Show my table</button>
    </main>
  );
}