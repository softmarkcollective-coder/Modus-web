'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

type GuestSeat = {
  table: number
}

type GuestData = {
  title: string
  date: string
  coverImage?: string
  hostMessage?: string
  tableImage?: string
  guests: Record<string, GuestSeat>
}

export default function GuestPage() {
  const params = useSearchParams()
  const eventId = params.get('event')
  const token = params.get('token')

  const [data, setData] = useState<GuestData | null>(null)
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [table, setTable] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/guest?event=${eventId}&token=${token}`)
        if (!res.ok) throw new Error('Failed to load event')
        const json = await res.json()
        setData(json)
      } catch {
        setError('Unable to load event')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [eventId, token])

  function findTable() {
    if (!data) return
    const key = name.trim().toLowerCase()
    const seat = data.guests[key]
    if (!seat) {
      setError('We couldn’t find a table for that name.')
      return
    }
    setTable(seat.table)
    setError(null)
  }

  function reset() {
    setName('')
    setTable(null)
    setError(null)
  }

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading…</div>
  }

  if (!data) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Event not found</div>
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-[#1a1a1a] p-6 space-y-6 shadow-xl">

        {/* HEADER */}
        <div className="text-center space-y-2">
          <div className="text-xs tracking-widest text-neutral-400">GUEST ACCESS</div>
          <h1 className="text-2xl font-semibold">
            {table ? 'Your table' : 'Find your seat'}
          </h1>
          <p className="text-sm text-neutral-400">
            {data.title} · {data.date}
          </p>
        </div>

        {/* HOST MESSAGE (optional) */}
        {data.hostMessage && !table && (
          <div className="rounded-lg bg-[#222] p-3 text-sm text-neutral-300">
            {data.hostMessage}
          </div>
        )}

        {/* FIND TABLE */}
        {!table && (
          <div className="space-y-4">
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full rounded-lg bg-[#111] border border-[#333] px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#c8a45d]"
            />

            <button
              onClick={findTable}
              className="w-full rounded-full bg-gradient-to-r from-[#d6b36a] to-[#b08a3c] py-3 font-medium text-black"
            >
              Show my table
            </button>

            {error && <p className="text-sm text-red-400 text-center">{error}</p>}
          </div>
        )}

        {/* RESULT */}
        {table && (
          <div className="space-y-6 text-center">
            <div>
              <div className="text-sm text-neutral-400">You’re seated at</div>
              <div className="text-4xl font-semibold mt-1">Table {table}</div>
            </div>

            {data.tableImage && (
              <img
                src={data.tableImage}
                alt="Table layout"
                className="rounded-lg border border-[#333]"
              />
            )}

            {data.hostMessage && (
              <div className="rounded-lg bg-[#222] p-3 text-sm text-neutral-300">
                {data.hostMessage}
              </div>
            )}

            <button
              onClick={reset}
              className="w-full rounded-full border border-[#333] py-2 text-sm text-neutral-300"
            >
              Start over
            </button>
          </div>
        )}

        <div className="text-center text-xs text-neutral-500 pt-2">
          Powered by Modus
        </div>
      </div>
    </div>
  )
}

