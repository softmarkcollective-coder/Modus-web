import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_VIBECODE_API_BASE;

export async function GET(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    if (!BASE_URL) {
      return NextResponse.json(
        { error: "VIBECODE base URL not configured" },
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

    const res = await fetch(
      `${BASE_URL}/api/public/event/${params.eventId}/guest?name=${encodeURIComponent(
        name
      )}`
    );

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: text || "Upstream error" },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Guest route error:", error);
    return NextResponse.json(
      { error: "Failed to fetch guest" },
      { status: 500 }
    );
  }
}