'use client';

import { useSearchParams } from 'next/navigation';

export default function GuestPage() {
  const searchParams = useSearchParams();
  const event = searchParams.get('event');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 px-6">
      <h1 className="text-2xl font-semibold mb-4">
        Find your seat
      </h1>

      {event ? (
        <p className="text-zinc-600">
          Event: <strong>{event}</strong>
        </p>
      ) : (
        <p className="text-red-500">
          No event provided
        </p>
      )}

      <button
        onClick={() => window.location.href = '/guest'}
        className="mt-8 rounded-md bg-black text-white px-6 py-2"
      >
        Start over
      </button>
    </div>
  );
}
