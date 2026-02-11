import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_VIBECODE_API_BASE;

export async function GET(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    if (!BASE_URL) {
      return NextResponse.json(
        { error: "VIBECODE_API_BASE not configured" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");

    if (!name) {
      return NextResponse.json(
        { error: "Missing guest name" },
        { status: 400 }
      );
    }

    const vibecodeUrl = `${BASE_URL}/api/public/event/${params.eventId}/guest?name=${encodeURIComponent(
      name
    )}`;

    const res = await fetch(vibecodeUrl);

    const text = await res.text();

    return new NextResponse(text, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Guest fetch error:", error);

    return NextResponse.json(
      { error: "Failed to fetch guest" },
      { status: 500 }
    );
  }
}