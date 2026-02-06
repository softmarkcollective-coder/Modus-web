import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const data = {
    title: 'Summer Party 2026',
    date: 'June 12 · 18:00',
    hostMessage: 'Dinner will be served at 18:30',
    seats: {
      claudia: { table: 7, seat: 3 },
      henrik: { table: 7, seat: 4 },
      alex: { table: 4, seat: 1 },
    },
  }

  return NextResponse.json(data)
}
