import { NextResponse } from "next/server";

/**
 * GLOBAL IN-MEMORY STORE
 * (lever så længe serverless instance lever)
 */
const store: {
  events: Record<
    string,
    {
      guests: { name: string; table: number }[];
      layout?: any;
    }
  >;
} = (globalThis as any).__MODUS_STORE__ || {
  events: {},
};

(globalThis as any).__MODUS_STORE__ = store;

/**
 * POST /api/guest/sync
 * Modtager data fra Mobile (SANDHEDEN)
 */
export async function POST(req: Request) {
  const body = await req.json();
  const { eventId, guests, layout } = body;

  if (!eventId || !guests) {
    return NextResponse.json(
      { ok: false, error: "Missing eventId or guests" },
      { status: 400 }
    );
  }

  // ✅ GEM PRÆCIS DET MOBILE SENDER
  store.events[eventId] = {
    guests,
    layout,
  };

  console.log("✅ SYNC OK FROM MOBILE:", eventId, guests);

  return NextResponse.json({ ok: true });
}

/**
 * GET /api/guest?eventId=xxx&name=Alex
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");
  const name = searchParams.get("name");

  if (!eventId || !name) {
    return NextResponse.json({ found: false });
  }

  const event = store.events[eventId];
  if (!event) {
    return NextResponse.json({ found: false });
  }

  const match = event.guests.find(
    (g) => g.name.toLowerCase() === name.toLowerCase()
  );

  if (!match) {
    return NextResponse.json({ found: false });
  }

  return NextResponse.json({
    found: true,
    guest: match,
  });
}