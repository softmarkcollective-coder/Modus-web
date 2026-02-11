export default function Page() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-4 py-6">

      <div className="max-w-xl mx-auto space-y-6">

        {/* Hero image */}
        <div className="rounded-2xl overflow-hidden h-40 md:h-56 bg-slate-800 flex items-center justify-center text-gray-500 text-sm">
          Event Image
        </div>

        {/* Event title */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold">Next Big Party</h1>
          <p className="text-xs uppercase tracking-widest text-gray-400">
            Find your table
          </p>
        </div>

        {/* Search */}
        <div className="flex gap-3">
          <input
            className="flex-1 bg-slate-800 rounded-xl px-4 py-3 text-sm"
            placeholder="Enter your name"
          />
          <button className="bg-yellow-400 text-black px-4 rounded-xl font-semibold text-sm">
            Search
          </button>
        </div>

        {/* Result card */}
        <div className="bg-slate-800 rounded-2xl p-5 text-center space-y-2">
          <p className="text-gray-400 text-xs uppercase tracking-wider">
            Welcome
          </p>
          <h2 className="text-lg font-semibold">Alex Scott</h2>
          <p className="text-3xl font-bold text-yellow-400">
            Table 1
          </p>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-3 gap-3 text-center text-xs">

          <div className="bg-slate-800 p-3 rounded-xl">
            <h3 className="font-semibold">Menu</h3>
          </div>

          <div className="bg-slate-800 p-3 rounded-xl">
            <h3 className="font-semibold">Agenda</h3>
          </div>

          <div className="bg-slate-800 p-3 rounded-xl">
            <h3 className="font-semibold">Seating</h3>
          </div>

        </div>

        {/* Visual seating layout */}
        <div className="bg-slate-800 rounded-2xl p-6">

          <h3 className="text-sm font-semibold mb-4 text-center">
            Room Layout
          </h3>

          <div className="grid grid-cols-3 gap-4 justify-items-center">

            {[1,2,3,4,5,6].map((table) => (
              <div
                key={table}
                className={`w-14 h-14 rounded-full flex items-center justify-center text-xs font-bold
                ${table === 1
                  ? "bg-yellow-400 text-black"
                  : "bg-slate-700 text-white"
                }`}
              >
                {table}
              </div>
            ))}

          </div>

        </div>

        <p className="text-center text-xs text-gray-500">
          7 tables at this event
        </p>

      </div>
    </div>
  )
}