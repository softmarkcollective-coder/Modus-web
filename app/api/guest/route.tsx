import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");

  if (!name) {
    return NextResponse.json({ found: false });
  }

  // 👇 KALD TIL APPEN (VIBECODE)
  // Skift URL’en til den endpoint, appen allerede har
  const appResponse = await fetch(
    `${process.env.APP_API_URL}/guest-lookup?name=${encodeURIComponent(name)}`,
    {
      cache: "no-store",
    }
  );

  if (!appResponse.ok) {
    // Appen svarer, men fandt ikke gæsten
    return NextResponse.json({ found: false });
  }

  const data = await appResponse.json();

  // Appen SKAL returnere data i dette format
  return NextResponse.json({
    found: true,
    event: {
      name: data.event.name,
      welcomeText: data.event.welcomeText,
      imageUrl: data.event.imageUrl,
    },
    result: {
      table: data.table,
    },
  });
}