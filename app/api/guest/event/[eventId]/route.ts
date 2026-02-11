import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_VIBECODE_API_BASE!;

export async function GET(
  _req: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const res = await fetch(
      `${BASE_URL}/api/public/event/${params.eventId}`
    );

    const text = await res.text();

    return new NextResponse(text, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}