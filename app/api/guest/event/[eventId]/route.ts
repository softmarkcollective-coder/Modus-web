import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_VIBECODE_API_BASE!;

export async function GET(
  _req: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const res = await fetch(
      `${BASE_URL}/api/public/event/${params.eventId}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: res.status }
      );
    }

    const data = await res.json();

    // 🔎 Debug (kan fjernes senere)
    console.log("VIBECODE EVENT RESPONSE:", data);

    return NextResponse.json({
      id: data.id,
      name: data.name,
      image: data.image ?? null,
      date: data.date ?? null,
      guestNote: data.guestNote ?? null,
      menu: data.menu ?? [],
      layout: {
        tables: data.layout?.tables ?? [],
      },
    });
  } catch (err) {
    console.error("EVENT FETCH ERROR:", err);

    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}