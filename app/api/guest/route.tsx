import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const name = searchParams.get("name");
  const eventId = searchParams.get("eventId");

  if (!name || !eventId) {
    return NextResponse.json(
      { found: false },
      { status: 200 }
    );
  }

  try {
    const res = await fetch(
      `${process.env.APP_API_URL}/api/guest/lookup?name=${encodeURIComponent(
        name
      )}&eventId=${encodeURIComponent(eventId)}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    const data = await res.json();

    // Vibecode lover altid 200 + { found: boolean }
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { found: false },
      { status: 200 }
    );
  }
}