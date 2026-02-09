import { NextResponse } from "next/server";

/**
 * GLOBAL IN-MEMORY STORE
 * (lever så længe serverless instance lever)
 */
const store: {
  events: Record<
    string,
    {
      tables: { name: string; table: string }[];
    }
  >;
} = (globalThis as any).__MODUS_STORE__ || {
  events: {},
};

(globalThis as any).__MODUS_STORE__ = store;

/**
 * POST /api/guest/sync
 * Modtager data fra Mobile
 */
export async function POST(req: Request) {
  const body = await req.json();
  const { eventId } = body;

  if (!eventId) {
    return NextResponse.json({ ok: false, error: "Missing eventId" }, { status: 400 });
  }

  // 🔧 DEMO-DATA (kan senere erstattes med ægte data fra Mobile)
  store.events[eventId] = {
    tables: [
      { name: "Alex", table: "Table 3" },
      { name: "Claudia", table: "Table 1" },
      { name: "Henrik", table: "Table 1" },
    ],
  };

  console.log("✅ SYNC OK:", eventId);

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

  const match = event.tables.find(
    (g) => g.name.toLowerCase() === name.toLowerCase()
  );

  if (!match) {
    return NextResponse.json({ found: false });
  }

  return NextResponse.json({
    found: true,
    table: match.table,
    guest: { name: match.name },
  });
}