import { NextResponse } from "next/server";

/**
 * GLOBAL IN-MEMORY STORE
 * (lever så længe serverless instance lever)
 */
const store: {
  events: Record<
    string,
    {
      name?: string;
      layout?: any;
      guests: { name: string; table: number }[];
    }
  >;
} = (globalThis as any).__MODUS_STORE__ || {
  events: {},
};

(globalThis as any).__MODUS_STORE__ = store;

/**
 * POST /api/guest/sync
 * Modtager RIGTIGE data fra Mobile
 */
export async function POST(req: Request) {
  const body = await req.json();
  const { eventId, name, layout, guests } = body;

  if (!eventId || !Array.isArray(guests)) {
    return NextResponse.json(
      { ok: false, error: "Missing eventId or guests" },
      { status: 400 }
    );
  }

  store.events[eventId] = {
    name,
    layout,
    guests,
  };

  console.log("✅ SYNC OK:", eventId, guests);

  return NextResponse.json({ ok: true });
}

/**
 * GET /api/guest?eventId=xxx&name=Alex Scott
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
    guest: {
      name: match.name,
      table: `Table ${match.table}`,
    },
  });
}