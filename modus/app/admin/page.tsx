'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

type Seat = {
  name: string
  table: number
  seat: number
}

type EventData = {
  title: string
  date: string
  hostMessage?: string
  seats: Record<string, { table: number; seat: number }>
}

export default function AdminPage() {
  const params = useSearchParams()
  const router = useRouter()

  const eventId = params.get('event')
  const token = params.get('token')

  const [data, setData] = useState<EventData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!eventId || !token) {
      setError('Missing event or token')
      setLoading(false)
      return
    }

    fetch(`/api/guest?event=${eventId}&token=${token}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load event')
        return res.json()
      })
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [eventId, token])

  if (loading) {
    return <Screen>Loading admin…</Screen>
  }

  if (error || !data) {
    return (
      <Screen>
        <Card>
          <h1>Admin error</h1>
          <p>{error ?? 'Unknown error'}</p>
          <Button onClick={() => router.push('/')}>Go back</Button>
        </Card>
      </Screen>
    )
  }

  // 🔁 Convert seats object → array
  const seatList: Seat[] = Object.entries(data.seats).map(
    ([name, seat]) => ({
      name,
      table: seat.table,
      seat: seat.seat,
    })
  )

  // 🧱 Group by table
  const tables = seatList.reduce((map, seat) => {
    if (!map.has(seat.table)) map.set(seat.table, [])
    map.get(seat.table)!.push(seat)
    return map
  }, new Map<number, Seat[]>())

  return (
    <Screen>
      <Card>
        <Small>ADMIN VIEW</Small>
        <h1>{data.title}</h1>
        <Muted>{data.date}</Muted>

        {data.hostMessage && (
          <Notice>{data.hostMessage}</Notice>
        )}

        {[...tables.entries()].map(([table, seats]) => (
          <TableCard key={table}>
            <strong>Table {table}</strong>
            <ul>
              {seats
                .sort((a, b) => a.seat - b.seat)
                .map(s => (
                  <li key={s.name}>
                    Seat {s.seat} — {s.name}
                  </li>
                ))}
            </ul>
          </TableCard>
        ))}

        <Divider />

        <Button onClick={() => router.push('/')}>
          Forlad / start forfra
        </Button>
      </Card>
    </Screen>
  )
}

/* ───────── UI helpers (samlet her) ───────── */

function Screen({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0b0b0c',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      color: '#fff',
    }}>
      {children}
    </div>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      width: '100%',
      maxWidth: 520,
      background: 'rgba(255,255,255,0.06)',
      borderRadius: 20,
      padding: 24,
      boxShadow: '0 20px 40px rgba(0,0,0,.4)',
    }}>
      {children}
    </div>
  )
}

function TableCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      marginTop: 16,
      padding: 16,
      borderRadius: 14,
      background: 'rgba(255,255,255,0.08)',
    }}>
      {children}
    </div>
  )
}

function Button({ children, onClick }: any) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        marginTop: 16,
        padding: '14px 16px',
        borderRadius: 999,
        border: 'none',
        background: 'linear-gradient(135deg,#e8c56a,#caa14a)',
        color: '#111',
        fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  )
}

function Small({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 12,
      letterSpacing: 1,
      opacity: 0.7,
      marginBottom: 6,
    }}>
      {children}
    </div>
  )
}

function Muted({ children }: { children: React.ReactNode }) {
  return <p style={{ opacity: 0.7 }}>{children}</p>
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      marginTop: 12,
      padding: 12,
      borderRadius: 10,
      background: 'rgba(255,255,255,0.1)',
      fontSize: 14,
    }}>
      {children}
    </div>
  )
}

function Divider() {
  return <div style={{ height: 24 }} />
}

