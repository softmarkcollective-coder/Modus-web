import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_VIBECODE_API_BASE;

export async function GET(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  try {
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

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch guest" },
      { status: 500 }
    );
  }
}