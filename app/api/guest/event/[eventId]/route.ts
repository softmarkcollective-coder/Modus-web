import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_VIBECODE_API_BASE;

export async function GET(
  _req: Request,
  { params }: { params: { eventId: string } }
) {
  if (!BASE_URL) {
    return NextResponse.json(
      { error: "Missing NEXT_PUBLIC_VIBECODE_API_BASE" },
      { status: 500 }
    );
  }

  const res = await fetch(
    `${BASE_URL}/api/public/event/${params.eventId}`
  );

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}