import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");

  return NextResponse.json({
    event: {
      name: "My Event",
      imageUrl:
        "https://images.unsplash.com/photo-1549373738-65c5cf36e93b",
      welcomeText: "Welcome to My party",
      tables: [
        {
          number: 1,
          seats: [
            { seat: 1, guestName: "Anna" },
            { seat: 2, guestName: name },
            { seat: 3, guestName: "Peter" },
            { seat: 4, guestName: "Louise" },
            { seat: 5, guestName: "Jonas" },
          ],
        },
      ],
    },
    result: {
      table: 1,
      seat: 2,
      totalSeats: 5,
    },
  });
}