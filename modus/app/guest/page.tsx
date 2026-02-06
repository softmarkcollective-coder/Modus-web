"use client";

import { useSearchParams } from "next/navigation";

export default function GuestClient() {
  const searchParams = useSearchParams();
  const event = searchParams.get("event");

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <h1 className="text-2xl font-semibold">
        Guest page {event ? `for event: ${event}` : ""}
      </h1>
    </div>
  );
}
