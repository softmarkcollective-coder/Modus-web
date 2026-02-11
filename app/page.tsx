export default function Page() {
  return (
    <div className="min-h-screen bg-[#0b1120] text-white px-4 py-6 flex items-center">
      <div className="max-w-md w-full mx-auto space-y-6">

        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Next Big Party
          </h1>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
            Find your table
          </p>
        </div>

        {/* Search */}
        <div className="space-y-4">

          <input
            className="
              w-full
              bg-[#111827]
              rounded-2xl
              px-5
              py-4
              text-center
              text-lg
              border
              border-[#d4af37]/40
              focus:outline-none
              focus:ring-2
              focus:ring-[#e6c76b]
              transition
            "
            placeholder="Enter your name"
          />

          <button
            className="
              w-full
              py-4
              rounded-2xl
              font-semibold
              text-black
              text-lg
              bg-gradient-to-r
              from-[#e6c76b]
              via-[#f5e6a3]
              to-[#c9a227]
              shadow-lg
              hover:brightness-110
              transition
            "
          >
            Search
          </button>

        </div>

        {/* Result card */}
        <div className="bg-[#111827] rounded-3xl p-6 text-center shadow-xl border border-white/5">
          <p className="text-gray-400 text-sm">Welcome</p>
          <h2 className="text-xl font-medium">Alex Scott</h2>
          <p className="text-4xl font-bold mt-3 bg-gradient-to-r from-[#e6c76b] via-[#f5e6a3] to-[#c9a227] bg-clip-text text-transparent">
            Table 1
          </p>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 gap-4">

          <div className="bg-[#111827] p-4 rounded-2xl border border-white/5 hover:border-[#e6c76b]/40 transition">
            <h3 className="font-medium">Menu</h3>
            <p className="text-sm text-gray-400">View dinner menu</p>
          </div>

          <div className="bg-[#111827] p-4 rounded-2xl border border-white/5 hover:border-[#e6c76b]/40 transition">
            <h3 className="font-medium">Agenda</h3>
            <p className="text-sm text-gray-400">See evening program</p>
          </div>

          <div className="bg-[#111827] p-4 rounded-2xl border border-white/5 hover:border-[#e6c76b]/40 transition">
            <h3 className="font-medium">Seating Plan</h3>
            <p className="text-sm text-gray-400">View full layout</p>
          </div>

        </div>

      </div>
    </div>
  )
}