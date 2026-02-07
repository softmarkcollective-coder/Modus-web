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

  const apiUrl = process.env.APP_API_URL;

  if (!apiUrl) {
    console.error("APP_API_URL is missing");
    return NextResponse.json(
      { found: false },
      { status: 200 }
    );
  }

  try {
    const res = await fetch(
      `${apiUrl}/api/guest/lookup?name=${encodeURIComponent(name)}&eventId=${encodeURIComponent(eventId)}`,
      { cache: "no-store" }
    );

    const json = await res.json();

    // Vibecode returnerer altid { found: boolean }
    return NextResponse.json(json, { status: 200 });

  } catch (error) {
    console.error("Guest lookup failed:", error);
    return NextResponse.json(
      { found: false },
      { status: 200 }
    );
  }
}