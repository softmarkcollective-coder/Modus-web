'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function GuestContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') ?? 'Guest';

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100">
      <h1 className="text-2xl font-semibold">
        Welcome, {name}
      </h1>
    </div>
  );
}

export default function GuestPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading guest…</div>}>
      <GuestContent />
    </Suspense>
  );
}
