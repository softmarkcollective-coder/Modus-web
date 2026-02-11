export default function Page() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-4 py-8">

      <div className="max-w-xl mx-auto space-y-8">

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Next Big Party</h1>
          <p className="text-sm uppercase tracking-widest text-gray-400">
            Find your table
          </p>
        </div>

        <div className="flex gap-3">
          <input
            className="flex-1 bg-slate-800 rounded-xl px-4 py-3"
            placeholder="Enter your name"
          />
          <button className="bg-yellow-400 text-black px-4 rounded-xl font-semibold">
            Search
          </button>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6 text-center">
          <p className="text-gray-400 text-sm">Welcome</p>
          <h2 className="text-xl font-semibold">Alex Scott</h2>
          <p className="text-4xl font-bold text-yellow-400 mt-3">Table 1</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="bg-slate-800 p-4 rounded-xl">
            <h3 className="font-semibold">Menu</h3>
            <p className="text-sm text-gray-400">View dinner menu</p>
          </div>

          <div className="bg-slate-800 p-4 rounded-xl">
            <h3 className="font-semibold">Agenda</h3>
            <p className="text-sm text-gray-400">See evening program</p>
          </div>

          <div className="bg-slate-800 p-4 rounded-xl">
            <h3 className="font-semibold">Seating Plan</h3>
            <p className="text-sm text-gray-400">View full layout</p>
          </div>

        </div>

      </div>
    </div>
  )
}