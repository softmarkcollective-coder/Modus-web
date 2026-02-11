import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_VIBECODE_API_BASE;

export async function GET(
  _req: Request,
  { params }: { params: { eventId: string } }
) {
  if (!BASE_URL) {
    return NextResponse.json(
      { error: "Missing VIBECODE base URL" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      `${BASE_URL}/api/public/event/${params.eventId}`,
      { cache: "no-store" }
    );

    const text = await res.text();

    return new NextResponse(text, {
      status: res.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Proxy error contacting Vibecode" },
      { status: 500 }
    );
  }
}